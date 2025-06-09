import pika
import os
import json


def publish_event(event_type: str, payload: dict, routing_key: str):
    """
    Fonction générique de publication vers RabbitMQ
    """
    try:
        rabbitmq_url = os.getenv("RABBITMQ_URL")
        connection = pika.BlockingConnection(pika.URLParameters(rabbitmq_url))
        channel = connection.channel()

        # Déclare l'exchange s'il n'existe pas
        channel.exchange_declare(
            exchange='etablissement.events',
            exchange_type='topic',
            durable=True
        )

        # Ajoute le type d'événement dans le payload
        payload["type"] = event_type

        # Publie le message
        channel.basic_publish(
            exchange='etablissement.events',
            routing_key=routing_key,
            body=json.dumps(payload),
            properties=pika.BasicProperties(
                delivery_mode=2  # rendre le message persistant
            )
        )
        connection.close()
        print(f"[x] Événement publié : {event_type} → {routing_key}")
    except Exception as e:
        print(f"[!] Erreur publication RabbitMQ ({event_type}): {e}")


# 🔄 Statut modifié
def publish_status_changed_event(etablissement_id: str, new_status: str):
    publish_event(
        event_type="EtablissementStatusChanged",
        payload={
            "etablissement_id": etablissement_id,
            "new_status": new_status
        },
        routing_key="etablissement.status.changed"
    )


# 🆕 Création d’un établissement
def publish_etablissement_created(etablissement_id: str, name: str):
    publish_event(
        event_type="EtablissementCreated",
        payload={
            "etablissement_id": etablissement_id,
            "name": name
        },
        routing_key="etablissement.created"
    )


# ⏳ Abonnement bientôt expiré
def publish_subscription_will_expire(etablissement_id: str, date_fin: str):
    publish_event(
        event_type="SubscriptionWillExpire",
        payload={
            "etablissement_id": etablissement_id,
            "subscription_end": date_fin
        },
        routing_key="etablissement.subscription.expire_soon"
    )
