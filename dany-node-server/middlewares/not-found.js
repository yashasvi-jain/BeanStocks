module.exports = (
    req,
    res
) => {
    res.status(404);
    res.json(
        {
            success: false,
            error: 'Not found'
        }
    );
    
    return;
};