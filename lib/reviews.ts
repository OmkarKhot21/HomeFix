// Reviews shown on the home page (above the FAQ).
// While these are placeholder examples, keep REVIEWS_ARE_SAMPLES = true so the section is labelled
// "Sample reviews". Replace with real customer reviews and set it to false.
export const REVIEWS_ARE_SAMPLES = true;

export interface Review {
  name: string;
  service: 'Plumbing' | 'Electrical';
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
}

export const REVIEWS: Review[] = [
  { name: 'Mayank K', service: 'Plumbing', rating: 5, text: 'Had a leaking tap in my kitchen. The technician arrived earlier than expected and fixed it in around 20 minutes. Good work and no unnecessary hassle.' },
  { name: 'Veer Butani', service: 'Electrical', rating: 5, text: 'Had an issue with my bedroom switchboard. The electrician arrived on time, identified the problem quickly and fixed it in around 20 minutes. Professional and efficient.' },
  { name: 'Ankit Barot', service: 'Plumbing', rating: 5, text: 'Booked HomeFix for a bathroom pipe leakage. The guy came on time, checked everything properly and got the work done quickly. Happy with the service.' },
  { name: 'Tanya Shenoy', service: 'Electrical', rating: 5, text: 'Booked HomeFix for a fan installation. The technician came earlier than expected and completed the work without wasting time. Everything is working perfectly.' },
  { name: 'Atharv', service: 'Plumbing', rating: 5, text: 'Very convenient service. My washbasin was clogged and the technician sorted it out in about 30 minutes. Clean work and explained the issue properly.' },
  { name: 'Aditya Dyno', service: 'Electrical', rating: 5, text: 'One of the lights in my kitchen wasn’t working. The electrician checked the wiring and fixed it within 30 minutes. Good service and explained what was wrong.' },
  { name: 'Jyotiraditya', service: 'Plumbing', rating: 5, text: 'Really good experience. The plumber arrived within the promised time, fixed the flush issue and checked if everything was working before leaving. Efficient service.' },
  { name: 'Simran Gupta', service: 'Electrical', rating: 5, text: 'Needed help with a faulty switch and loose wiring. The electrician arrived on time, did the repair properly and checked everything before leaving. Nice experience.' },
  { name: 'Sharad Singh', service: 'Plumbing', rating: 5, text: 'Needed a tap replacement urgently. The technician came early, completed the installation in around 25 minutes and cleaned up after the work. Satisfied with the experience.' },
  { name: 'Siya', service: 'Electrical', rating: 5, text: 'Booked an electrician for multiple small issues at home. He arrived early, completed everything in one visit and worked very efficiently. Saved me a lot of time.' },
];
