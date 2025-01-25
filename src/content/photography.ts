export interface Photo {
  id: string;
  url: string;
  title: string;
}

// Seeded random number generator
function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffleArray<T>(array: T[], seed: number): T[] {
  const rng = mulberry32(seed);
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

const basePhotos: Photo[] = [
  {
    id: "2",
    url: "/images/photography/178097463_469941617565235_6360454411926939899_n_17942771851470045.jpg",
    title: "Photo taken by Canon R10",
  },
  {
    id: "3",
    url: "/images/photography/409086098_406548931922595_6521829370440557640_n_18020199911030486.jpg",
    title: "Photo taken by Canon R10",
  },
  {
    id: "4",
    url: "/images/photography/411292069_2297283560631903_3093924165127903535_n_17969987357653436.jpg",
    title: "Photo taken by Canon R10",
  },
  {
    id: "5",
    url: "/images/photography/411482088_1918539048560869_2186715555807134332_n_17895939701857803.jpg",
    title: "Photo taken by Canon R10",
  },
  {
    id: "6",
    url: "/images/photography/411874096_347469027899437_1850946179864583434_n_17969714951514962.jpg",
    title: "Photo taken by Canon R10",
  },
  {
    id: "7",
    url: "/images/photography/412010441_1078219936548993_3818761277752848969_n_18008089229498669.jpg",
    title: "Photo taken by Canon R10",
  },
  {
    id: "8",
    url: "/images/photography/412063843_1414528029181980_5501528413776589667_n_18218227135267807.jpg",
    title: "Photo taken by Canon R10",
  },
  {
    id: "9",
    url: "/images/photography/412127465_880363573584988_8355307288833134974_n_18038352664571123.jpg",
    title: "Photo taken by Canon R10",
  },
  {
    id: "10",
    url: "/images/photography/412252079_733380928713353_5570743981145439356_n_17980265279450346.jpg",
    title: "Photo taken by Canon R10",
  },
  {
    id: "11",
    url: "/images/photography/414252103_385481040684035_3566629346900584336_n_17987006060605168.jpg",
    title: "Photo taken by Canon R10",
  },
  {
    id: "12",
    url: "/images/photography/414521235_1376413599635852_7360602973966600146_n_17914971296779080.jpg",
    title: "Photo taken by Canon R10",
  },
  {
    id: "13",
    url: "/images/photography/419018504_927760628244073_1647534186214519352_n_17950365257742213.jpg",
    title: "Photo taken by Canon R10",
  },
  {
    id: "14",
    url: "/images/photography/422844931_744955200896175_7319776175868933989_n_17984715230624148.jpg",
    title: "Photo taken by Canon R10",
  },
  {
    id: "15",
    url: "/images/photography/423417355_3343276312638200_3259814864485850968_n_18220862386256151.jpg",
    title: "Photo taken by Canon R10",
  },
  {
    id: "16",
    url: "/images/photography/426266277_756528093020037_706342908803448769_n_18109031614368423.jpg",
    title: "Photo taken by Canon R10",
  },
  {
    id: "17",
    url: "/images/photography/427545796_1455006901747649_3277885628214365443_n_18217641394283016.jpg",
    title: "Photo taken by Canon R10",
  },
  {
    id: "18",
    url: "/images/photography/429945939_413463237863009_7500024597211384038_n_17958157421713703.jpg",
    title: "Photo taken by Canon R10",
  },
  {
    id: "19",
    url: "/images/photography/434128246_7974236325937946_6745466403786032353_n_18025804996845233.jpg",
    title: "Photo taken by Canon R10",
  },
  {
    id: "20",
    url: "/images/photography/446228392_826042676106513_7110785454453998363_n_17949886775686208.jpg",
    title: "Photo taken by Canon R10",
  },
  {
    id: "21",
    url: "/images/photography/446234751_1143726383485390_8602615406895102832_n_18055644772614727.jpg",
    title: "Photo taken by Canon R10",
  },
  {
    id: "22",
    url: "/images/photography/465026609_3954146761575287_2048151082505815205_n_18305760352160948.jpg",
    title: "Photo taken by Canon R10",
  },
  {
    id: "23",
    url: "/images/photography/465068568_895842192182249_8040610733949550142_n_17847596118307281.jpg",
    title: "Photo taken by Canon R10",
  },
  {
    id: "24",
    url: "/images/photography/465437950_2594335794100890_3388366130976247597_n_18046816670061597.jpg",
    title: "Photo taken by Canon R10",
  },
  {
    id: "25",
    url: "/images/photography/466374413_8433049320126218_3439629690272193057_n_18064264198739107.jpg",
    title: "Photo taken by Canon R10",
  },
  {
    id: "26",
    url: "/images/photography/466410042_1728318424687616_6580584064054823079_n_18031740728521131.jpg",
    title: "Photo taken by Canon R10",
  },
  {
    id: "27",
    url: "/images/photography/466419853_875293761048832_6822479344139378922_n_18010092311479459.jpg",
    title: "Photo taken by Canon R10",
  },
  {
    id: "28",
    url: "/images/photography/467651715_554565750612401_3716754155568668388_n_18074136340551934.jpg",
    title: "Photo taken by Canon R10",
  },
  {
    id: "29",
    url: "/images/photography/467751193_1277482226738822_6376662490050152731_n_18032949416116009.jpg",
    title: "Photo taken by Canon R10",
  },
  {
    id: "30",
    url: "/images/photography/467945838_1293347565342404_5875684640476924346_n_18022465385308405.jpg",
    title: "Photo taken by Canon R10",
  },
  {
    id: "31",
    url: "/images/photography/472407027_18474717418057838_1433985091113061062_n_18056179438805295.jpg",
    title: "Photo taken by Canon R10",
  },
  {
    id: "32",
    url: "/images/photography/473114456_18476545042057838_5340214265050603336_n_18281418508221005.jpg",
    title: "Photo taken by Canon R10",
  },
  {
    id: "33",
    url: "/images/photography/473544970_18476545066057838_8304260302188858806_n_18280129081216177.jpg",
    title: "Photo taken by Canon R10",
  },
  {
    id: "34",
    url: "/images/photography/473604400_18476545033057838_572694924582756637_n_17864084298299554.jpg",
    title: "Photo taken by Canon R10",
  },
  {
    id: "35",
    url: "/images/photography/473611651_18476545075057838_154577684581319101_n_18117890209420923.jpg",
    title: "Photo taken by Canon R10",
  },
  {
    id: "36",
    url: "/images/photography/473653699_18476545054057838_5004273801838560158_n_18257015881272151.jpg",
    title: "Photo taken by Canon R10",
  },
  {
    id: "37",
    url: "/images/photography/473782242_18476545024057838_8782814012027715729_n_18213879994289025.jpg",
    title: "Photo taken by Canon R10",
  },
  {
    id: "38",
    url: "/images/photography/474697961_18478152229057838_6796577213583039252_n_18092261323521517.jpg",
    title: "Photo taken by Canon R10",
  },
  {
    id: "39",
    url: "/images/photography/474711102_18478152175057838_1796576364937276926_n_17997307214733234.jpg",
    title: "Photo taken by Canon R10",
  },
  {
    id: "40",
    url: "/images/photography/474906480_18478152193057838_2711464028279751791_n_18041578751363734.jpg",
    title: "Photo taken by Canon R10",
  },
  {
    id: "41",
    url: "/images/photography/474934160_18478152220057838_7567593024467049935_n_18059867353754606.jpg",
    title: "Photo taken by Canon R10",
  },
] as const;

export const getPhotos = (seed: number = 42) => shuffleArray(basePhotos, seed);
