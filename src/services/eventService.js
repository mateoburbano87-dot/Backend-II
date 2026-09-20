async updateEvent(id, updateData, userId, userRole) {
    const event = await EventRepository.findById(id);
    if (!event) {
        throw AppError.notFound('Evento no encontrado');
    }

    if (event.status === 'cancelled') {
        throw AppError.forbidden('No se puede modificar un evento cancelado');
    }

    if (event.status === 'finished') {
        throw AppError.forbidden('No se puede modificar un evento finalizado');
    }

    // Permisos
    if (userRole === 'user') {
        throw AppError.forbidden('No tenés permisos para modificar eventos');
    }

    if (userRole === 'organizer') {
        const organizerId = event.organizer._id?.toString() || event.organizer.toString();
        if (organizerId !== userId.toString()) {
            throw AppError.forbidden('No tenés permisos para modificar este evento');
        }
    }

    // Validaciones
    if (updateData.date && new Date(updateData.date) < new Date()) {
        throw AppError.badRequest('La fecha del evento debe ser futura');
    }

    if (updateData.status) {
        const validStatuses = ['draft', 'published', 'cancelled', 'finished'];
        if (!validStatuses.includes(updateData.status)) {
            throw AppError.badRequest('Status inválido');
        }

        if (updateData.status === 'published' && event.date < new Date()) {
            throw AppError.badRequest('No se puede publicar un evento con fecha pasada');
        }

        if (updateData.status === 'cancelled') {
            if (event.status === 'cancelled') {
                throw AppError.conflict('El evento ya está cancelado');
            }
            if (event.status === 'finished') {
                throw AppError.forbidden('No se puede cancelar un evento finalizado');
            }
        }
    }

    delete updateData.organizer;
    return await EventRepository.update(id, updateData);
}