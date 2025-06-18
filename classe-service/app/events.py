import pika
import os
import json
from datetime import datetime


def publish_classe_event(event_type: str, payload: dict, routing_key: str = "classe.event"):
    """
    Publie un événement dans RabbitMQ sur l'exchange `classe.events`.

    Args:
        event_type (str): Type de l’événement, ex: 'ClasseCreated', 'EnseignantAssigned'
        payload (dict): Données à transmettre (id classe, infos)
        routing_key (str): Clé de routage RabbitMQ (default: 'classe.event')
    """
    try:
        rabbitmq_url = os.getenv("RABBITMQ_URL", "amqp://user:pass@rabbitmq:5672/")
        connection = pika.BlockingConnection(pika.URLParameters(rabbitmq_url))
        channel = connection.channel()

        # Créer exchange si pas encore déclaré
        channel.exchange_declare(
            exchange='classe.events',
            exchange_type='topic',
            durable=True
        )

        message = {
            "type": event_type,
            "timestamp": datetime.utcnow().isoformat(),
            "data": payload
        }

        # Publier le message
        channel.basic_publish(
            exchange='classe.events',
            routing_key=routing_key,
            body=json.dumps(message),
            properties=pika.BasicProperties(
                delivery_mode=2  # message persistant
            )
        )

        connection.close()

    except Exception as e:
        print(f"Erreur publication événement RabbitMQ : {e}")
