export const researchContent = {
  title: "Research",
  description: `My research focuses on innovative applications of machine learning, with a particular emphasis on computer vision and deep learning. 
  My previous work spans image and video generative models, image segmentation, and recommendation systems.
  I am motivated by solving challenging problems that require focused effort and lead to meaningful real-world impact.`,
  sections: {
    currentWork: {
      title: "Current Work",
      description:
        "At Lightricks, I'm focusing on generative models and their applications in creative tools.",
      link: {
        text: "Learn more about my research",
        href: "/research",
        ariaLabel: "Learn more about my research work",
      },
    },
    relatedInterests: {
      title: "Related Interests",
      links: [
        {
          text: "Explore my photography work",
          href: "/photography",
          ariaLabel: "View my photography work",
          icon: "camera",
        },
        {
          text: "Learn about my background",
          href: "/personal",
          ariaLabel: "Learn more about my background",
          icon: "user",
        },
      ],
    },
  },
} as const;
