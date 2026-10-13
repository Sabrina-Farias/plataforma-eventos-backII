export class TicketDetailDTO {
    constructor(ticket) {
        this.id = ticket._id;
        this.reservationCode = ticket.reservationCode;
        this.status = ticket.status;
        this.price = ticket.price;
        this.purchaseDatetime = ticket.purchase_datetime || ticket.createdAt;
        this.cancelledAt = ticket.cancelledAt;

        if (ticket.event) {
            this.event = {
                id: ticket.event._id,
                title: ticket.event.title,
                date: ticket.event.date,
                location: ticket.event.location,
                status: ticket.event.status
            };
        }

        if (ticket.user) {
            this.user = {
                id: ticket.user._id,
                email: ticket.user.email,
                name: ticket.user.first_name ? `${ticket.user.first_name} ${ticket.user.last_name || ''}`.trim() : undefined
            };
        }
    }
}
