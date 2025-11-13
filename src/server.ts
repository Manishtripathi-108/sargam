import app from './app.ts';

const PORT = process.env.PORT || 3000;

const start = async () => {
    try {
        await app.listen({ port: Number(PORT) });
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};

start();
