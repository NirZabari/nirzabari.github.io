export const aboutContent = {
  title: 'Personal',
  introduction:
    'I grew up in Jerusalem, Israel. When I’m not working, I love diving into creative projects, exploring new adventures, and chasing that adrenaline rush.',

  personalImages: [
    {
      url: '/images/about/pazael.jpg',
      alt: 'Motorcycle adventure',
    },
    {
      url: '/images/about/skydive_dubai.jpg',
      alt: 'Skydiving',
    },
    {
      url: '/images/about/blitz.jpg',
      alt: 'Blitz the Bengal cat',
    },
  ],

  hobbies: [
    {
      icon: 'camera',
      title: 'Photography',
      description:
        "I've been interested in photography since childhood, starting with mobile. Current gear: Canon R10.",
      image:
        '/images/photography/427545796_1455006901747649_3277885628214365443_n_18217641394283016.jpg',
    },
    {
      icon: 'bike',
      title: 'Motorcycles',
      description:
        'I enjoy riding motorcycles, and currently own a Honda CB500X. I also enjoy mini-bikes in the circuit.',
      image: '/images/about/mini-bike.jpg',
    },
    {
      icon: 'crown',
      title: 'Chess',
      description:
        "I was trained by a GM and achieved a peak blitz rating of 1700 within a year. Let's play!",
      image: '/images/about/chess_2.jpg',
    },
    {
      icon: 'snowflake',
      title: 'Extreme Sports',
      description:
        'Enjoy adrenaline. Kitesurfing, skydiving, snowboarding, skiing, and more.',
      image: '/images/about/skydive_dubai.jpg',
    },
    {
      icon: 'cat',
      title: 'Cats',
      description:
        'I have two Bengal cats, Blitz and Luna, who are my catpilots.',
      image: '/images/about/blitz.jpg',
    },
  ],
} as const;
