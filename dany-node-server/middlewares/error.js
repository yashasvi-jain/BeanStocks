module.exports = (
    error,
    req,
    res,
    next
) => {
    console.error(error);

    res.status(500);
    res.json(
        {
            success: false,
            error: 'Internal server error'
        }
    );

    return;
};