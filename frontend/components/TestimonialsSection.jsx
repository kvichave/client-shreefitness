import { AnimatedTestimonials } from "./ui/animated-testimonials";

export function AnimatedTestimonialsDemo() {
  const testimonials = [
    {
      quote:
        "My name is Priyasha. I’m studying Engineering and have been attending Shree Fitness for a while now. The gym has been amazing, with friendly trainers and equipment that helps me maintain a healthier lifestyle. It’s a great place to relieve stress and stay motivated!",
      name: "Priyasha",
      designation: "20 years old",
      src: "/videos/testimonial1.mp4",
    },
    {
      quote:
        "I’ve been training at Shree Fitness for a year, and it’s been an incredible experience. The gym is well-equipped with high-quality equipment and offers a variety of sections like cardio, weights, and kickboxing. It’s perfect for beginners and has everything you need to stay fit. Highly recommend it to anyone looking for a great place to train!",
      name: "Aryan Shirwalkar",
      designation: "23 year old",
      src: "/videos/testimonial2.mp4",
    },

    {
      quote: `I have been coming to this gym for the past 8 months.
This gym is the perfect place to relax and stay fit, with a very comfortable atmosphere.
The trainers are friendly and supportive, making workouts enjoyable and effective.`,
      name: "Dr. Sakshi Surve",
      designation: "26 years old",
      src: "/videos/testimonial3.mp4",
    },
    // {
    //   quote:
    //     "Outstanding support and robust features. It's rare to find a product that delivers on all its promises.",
    //   name: "James Kim",
    //   designation: "Engineering Lead at DataPro",
    //   src: "/background.mp4",
    // },
    // {
    //   quote:
    //     "The scalability and performance have been game-changing for our organization. Highly recommend to any growing business.",
    //   name: "Lisa Thompson",
    //   designation: "VP of Technology at FutureNet",
    //   src: "/background.mp4",
    // },
  ];
  return (
    <>
      <div className="bg-black">
        <h1 className="pt-[8rem] pb-[4rem] text-4xl font-bold tracking-tight text-white sm:text-5xl text-center">
          Testimonials
        </h1>
        <AnimatedTestimonials testimonials={testimonials} />
      </div>
    </>
  );
}
