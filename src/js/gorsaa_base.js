export const createEvent = (eventName,detail) => new CustomEvent(eventName, {detail});
export const messageMustBeShow = (messageType) => createEvent('messageMustBeShow', messageType);
export const getElement = (selector) => document.querySelector(selector);
export const getElements = (selector) => document.querySelectorAll(selector);
export const unsubscribeEvent = (element, eventName, callBackFunction) => element.removeEventListener(eventName, callBackFunction);
export const subscribeEvent = (element, eventName, callBackFunction) =>
{
    element.addEventListener(eventName, callBackFunction);
    return () => unsubscribeEvent(element, eventName, callBackFunction);
}

export const subscribeEventToElements = (elements, eventName, callBackFunction) => {
    elements.forEach((elem) => subscribeEvent(elem, eventName, callBackFunction));
    return () => elements.forEach((elem) => unsubscribeEvent(elem, eventName, callBackFunction));
}

export const unsubscribeEventToElements = (elements, eventName, callBackFunction) => elements.forEach((elem) => unsubscribeEvent(elem, eventName, callBackFunction));
export const removeClass = (element,className) => element.classList.remove(className);
export const addClass = (element,className) => element.classList.add(className);
export const hasClass = (element,className) => element.classList.contains(className);
export const riseEvent = (element,event) => element.dispatchEvent(event);
export const forEach = (elements,callBack) => elements.forEach((elm, index) => callBack(elm, index));
export const isOldIE = !!window.MSInputMethodContext && !!document.documentMode;
export const subscriptionTouchMoveEvent = (element, moveLeftCallback, moveRightCallback, moveUpCallback, moveDownCallback, steps, deviceType= 'ALL', isOnes = true)=>{
    let isMouseDown = false;
    let startDragCursorPositionX = 0;
    let startDragCursorPositionY = 0;

    const getCurrentCursorPositionX = (cursor,isTouchAction) => !isTouchAction ? cursor.pageX : cursor.touches[0].clientX;
    const getCurrentCursorPositionY = (cursor,isTouchAction) => !isTouchAction ? cursor.pageY : cursor.touches[0].clientY;
    const onPressed=(cursor, isTouchAction)=>{
        isMouseDown = true;
        startDragCursorPositionX = getCurrentCursorPositionX(cursor, isTouchAction);
        startDragCursorPositionY = getCurrentCursorPositionY(cursor, isTouchAction);
    }
    const onUnPressed = () => isMouseDown = false;

    const onMove=(cursor, isTouchAction) => {
        if (isMouseDown) {
            const isCurrentPositionX = getCurrentCursorPositionX(cursor, isTouchAction);
            const isCurrentPositionY = getCurrentCursorPositionY(cursor, isTouchAction);
            const delX = isTouchAction ? steps.TouchX : steps.PcX;
            const delY = isTouchAction ? steps.TouchY : steps.PcY;
            const directionX =
                (startDragCursorPositionX - isCurrentPositionX) / delX > 1 ? 'left' :
                    (startDragCursorPositionX - isCurrentPositionX) / delX < -1 ? 'right' : null;

            const directionY =
                (startDragCursorPositionY - isCurrentPositionY) / delY > 1 ? 'up' :
                    (startDragCursorPositionY - isCurrentPositionY) / delY < -1 ? 'down' : null;

            isOnes && (directionX != null || directionY != null) ? onUnPressed() : null;

            switch (directionX) {
                case 'left':
                    moveLeftCallback != null ? moveLeftCallback() : null;
                    break;
                case 'right':
                    moveRightCallback != null ? moveRightCallback() : null;
                    break;
            }
            switch (directionY) {
                case 'up':
                    moveUpCallback != null ? moveUpCallback() : null;
                    break;
                case 'down':
                    moveDownCallback != null ? moveDownCallback() : null;
                    break;
            }
        }
    }

    const onDragStartEventHandler = () => false;
    const onTouchstartEventHandler = (cursor) => onPressed(cursor, true);
    const onTouchmoveEventHandler = (cursor) =>onMove(cursor, true);
    const onMousedownEventHandler = (cursor) =>onPressed(cursor, false);
    const onMousemoveEventHandler = (cursor) =>onMove(cursor, false);

    const subscribeTouch = (element) => {
        subscribeEvent(element, 'touchstart', onTouchstartEventHandler);
        subscribeEvent(element, 'touchmove', onTouchmoveEventHandler);
        subscribeEvent(element, 'touchend', onUnPressed);
        subscribeEvent(element, 'touchcancel', onUnPressed);
    };

    const subscribeMouse = (element) => {
        subscribeEvent(element, 'dragstart', onDragStartEventHandler);
        subscribeEvent(element, 'mouseup', onUnPressed);
        subscribeEvent(element, 'mouseleave', onUnPressed);
        subscribeEvent(element, 'mousedown', onMousedownEventHandler);
        subscribeEvent(element, 'mousemove', onMousemoveEventHandler);
    };

    const unsubscribeTouch = () => {
        unsubscribeEvent(element, 'touchstart', onTouchstartEventHandler);
        unsubscribeEvent(element, 'touchmove', onTouchmoveEventHandler);
        unsubscribeEvent(element, 'touchend', onUnPressed);
        unsubscribeEvent(element, 'touchcancel', onUnPressed);
    };

    const unsubscribeMouse = () => {
        unsubscribeEvent(element, 'dragstart', onDragStartEventHandler);
        unsubscribeEvent(element, 'mouseup', onUnPressed);
        unsubscribeEvent(element, 'mouseleave', onUnPressed);
        unsubscribeEvent(element, 'mousedown', onMousedownEventHandler);
        unsubscribeEvent(element, 'mousemove', onMousemoveEventHandler);
    };

    switch (deviceType.toLowerCase()) {
        case 'all':
            subscribeTouch(element);
            subscribeMouse(element);
            return () => {
                unsubscribeTouch();
                unsubscribeMouse();
            };
            break;
        case 'touch':
            subscribeTouch(element);
            return unsubscribeTouch;
            break;
        case 'mouse':
            subscribeMouse(element);
            return unsubscribeMouse;
            break;
    }
};

export const hasSessionStorage=(()=>{
    try {
        sessionStorage.setItem('test-key', '1');
        sessionStorage.getItem('test-key');
        sessionStorage.removeItem('test-key');
        return true;
    }
    catch (e) {
        return false;
    }
})();

export const saveToSessionStorage = (key,value) => hasSessionStorage ? sessionStorage.setItem(key, value) : null;
export const getFromSessionStorage = (key) => hasSessionStorage ? sessionStorage.getItem(key) :null;

export const bodyElement = getElement('body');
export const showMessage = (text, messageType= 'ok') => {
    getElement('.message-container_message-text').innerHTML = text;
    const messageBox = getElement('.message-container');
    messageBox.classList = Array.prototype.filter.call(messageBox.classList, (elm) => elm == 'message-container');

    messageBox.classList.add((() => {
        switch (messageType.toLowerCase()) {
            case 'error': return 'message_error';
            case 'await': return 'message_await';
            default:return 'message_ok';
        }
    })());

    bodyElement.dispatchEvent(messageMustBeShow(messageType));
};

export const setServiceWorker = function() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js')
            .then(
                () => navigator.serviceWorker.ready.then((worker) =>
                {
                    worker.sync.register('syncdata');
                })
            )
            .catch((err) => console.log('Error Text: '+err));
    }
};