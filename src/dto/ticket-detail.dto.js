export class TicketDetailDTO {
    constructor(ticket) {
        this.id = ticket._id;
        this.reservationCode = ticket.reservationCode;
        this.quantity = ticket.quantity;
        this.status = ticket.status;
        this.createdAt = ticket.createdAt;
        this.cancelledAt = ticket.cancelledAt;

        if (ticket.user && typeof ticket.user === 'object' && ticket.user._id) {
            this.user = {
                id: ticket.user._id,
                first_name: ticket.user.first_name,
                last_name: ticket.user.last_name,
                email: ticket.user.email
            };
        } else {
            this.user = { id: ticket.user || null };
        }

        if (ticket.event && typeof ticket.event === 'object' && ticket.event._id) {
            this.event = {
                id: ticket.event._id,
                title: ticket.event.title,
                date: ticket.event.date,
                location: ticket.event.location,
                price: ticket.event.price
            };
        } else {
            this.event = { id: ticket.event || null };
        }
    }
}
