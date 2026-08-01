class ApiResponse {

    static ok(res, message, data=null){
        return res.status(200).json({
            status:true,
            message,
            data,
        })
    };
    static created(res, message, data=null){
        return res.status(201).json({
            status:true,
            message,
            data,
        })
    };

    static noContent(res, message, data=null){
        return res.sendStatus(204);
    };
}

export default ApiResponse;