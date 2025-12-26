export const loggerMiddleware = (store) => {
    return function(next){
       return function(action){
        console.log("LOG :", action.type, new Date().toString());
        const result = next(action);
        console.log("STORE :", store.getState());
        return result;
       };
    };
};