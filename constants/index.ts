const dev = process.env.NODE_ENV === "development"

export const server = dev ? `http://${process.env.SERVER_DOMAIN}:${process.env.PORT}` : "palehazy.com"