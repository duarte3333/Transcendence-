import json

async def handle_chat_message(consumer, message):
    chat_message = message['message']
    await consumer.channels_layer.group_send(
        consumer.group_name,
        {
            'type': 'chat_message',
            'message': chat_message
        }
    )
#
