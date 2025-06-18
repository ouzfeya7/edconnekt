import pika
import os
import json
from datetime import datetime


def publish_eleve_event(event_type: str, payload: dict, routing_key: str = "eleve.event"):
    """
    Publie un événement dans RabbitMQ sur l'exchange `eleve.events`.

    Args:
        event_type (str): Nom de l’événement (ex: 'EleveCreated')
        payload (dict): Données à transmettre (dict)
        routing_key (str): Clé de routage RabbitMQ (default: 'eleve.event')
    """
    try:
        # Récupération de la configuration
        rabbitmq_url = os.getenv("RABBITMQ_URL", "amqp://user:pass@rabbitmq:5672/")
        connection = pika.BlockingConnection(pika.URLParameters(rabbitmq_url))
        channel = connection.channel()

        # Déclaration de l'exchange (type topic)
        channel.exchange_declare(
            exchange='eleve.events',
            exchange_type='topic',
            durable=True
        )

        # Construction du message
        message = {
            "type": event_type,
            "timestamp": datetime.utcnow().isoformat(),
            "data": payload
        }

        # Publication du message
        channel.basic_publish(
            exchange='eleve.events',
            routing_key=routing_key,
            body=json.dumps(message),
            properties=pika.BasicProperties(
                delivery_mode=2  # persistance du message
            )
        )

        connection.close()

    except Exception as e:
        print(f"[RabbitMQ] ❌ Erreur publication événement : {str(e)}")
