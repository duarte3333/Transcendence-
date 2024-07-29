import { handleChatMessage } from '../chat/handlers.js';
// import { handleGameMove } from '../game/handler.js';

export function routeMessage(data) {
    let messageType = data.type;

    if (messageType === 'chat_message')
        handleChatMessage(data);
    // } else if (messageType === 'game_move') {
    //     handleGameMove(data);
    // }
}