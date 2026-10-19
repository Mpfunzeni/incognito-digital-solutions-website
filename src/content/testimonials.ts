/**
 * Approved client testimonials. Only add genuine testimonials that the client
 * has approved for publication. While this list is empty, the homepage shows
 * nothing in its place (no placeholder reviews are ever displayed).
 */
export type Testimonial = {
  quote: string;
  name: string;
  role?: string;
  company?: string;
  /** Date the client approved publication, for your records. */
  approvedOn: string;
};

export const testimonials: Testimonial[] = [];
