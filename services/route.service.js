const RouteRepository = require("../repositories/route.repositories");

class RouteService {
    static async create(data) {
        const existingRoute = await RouteRepository.findByOriginDestination(
            data.origin,
            data.destination
        );

        if (existingRoute) {
            throw new Error("Route already exists");
        }

        return await RouteRepository.create(data);
    }

    static async findAll(page, limit) {
        return await RouteRepository.findAll(page, limit);
    }

    static async findById(id) {
        const route = await RouteRepository.findById(id);
        if (!route) {
            throw new Error("Route not found");
        }
        return route;
    }

    static async update(id, data) {
        const existingRoute = await RouteRepository.findById(id);
        if (!existingRoute) {
            throw new Error("Route not found");
        }

        if (data.origin || data.destination) {
            const checkOrigin = data.origin || existingRoute.origin;
            const checkDestination = data.destination || existingRoute.destination;
            const duplicate = await RouteRepository.findByOriginDestination(checkOrigin, checkDestination);
            if (duplicate && duplicate.id !== id) {
                throw new Error("Route already exists with this origin and destination");
            }
        }

        return await RouteRepository.update(id, data);
    }

    static async delete(id) {
        const existingRoute = await RouteRepository.findById(id);
        if (!existingRoute) {
            throw new Error("Route not found");
        }

        return await RouteRepository.delete(id);
    }
}

module.exports = RouteService;
