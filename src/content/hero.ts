export const heroContent = {
  greeting: "Hi! I'm Nir.",
  title: '',
  description: [
    'I am a Researcher on the Model Foundations team at Lightricks, where I helped develop LTX-Video, a state-of-the-art video generative model. I work on video and image generation, large-scale data curation, and shipping GenAI features to millions of users. Previously, I was a Data Scientist at Microsoft, working on recommendation systems and LLM distillation. Earlier, at Mobileye, I designed and initiated ME-Search, which became a company-wide tool for image retrieval, and led image segmentation models deployment.',
    'I hold an M.Sc. in Computer Science (summa cum laude) from the Hebrew University of Jerusalem, where my research focused on deep learning for embryo implantation assessment and open-vocabulary semantic segmentation.',
  ],
  socialLinks: [
    {
      type: 'email',
      href: 'mailto:nir.zabari@mail.huji.ac.il',
      label: 'Email',
    },
    {
      type: 'linkedin',
      href: 'https://www.linkedin.com/in/nir-zabari-3a971486/',
      label: 'LinkedIn',
    },
    {
      type: 'scholar',
      href: 'https://scholar.google.co.il/citations?hl=iw&user=vYfD0bsAAAAJ',
      label: 'Google Scholar',
    },
    {
      type: 'twitter',
      href: 'https://x.com/nirzabari',
      label: 'Twitter',
    },
    {
      type: 'github',
      href: 'https://github.com/NirZabari',
      label: 'GitHub',
    },
  ],
  image: {
    src: '/images/portraits/portrait_nir.png',
    src_hover: '/images/portraits/portrait_nir_lora.png',
    alt: 'A portrait of Nir Zabari',
  },
} as const;
