export const heroContent = {
  greeting: "Nir Zabari",
  title: "",
  description: [
    'I am a Researcher on the Model Foundations team at Lightricks, where I work on the development of LTX-Video. I build video and image generation systems, develop large-scale data curation pipelines, and ship GenAI features used by millions of users. Previously, I was a Data Scientist at Microsoft (recommendation systems and LLM distillation). Earlier, at Mobileye, I designed and initiated ME-Search, which became a company-wide tool for image retrieval, and led image segmentation model deployments.',
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
