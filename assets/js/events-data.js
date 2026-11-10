/**
 * Jingle Bells event catalogue.
 * Add a new event: copy an object, set id/title/description/category/theme,
 * then add photos under assets/events/<id>/ (cover.jpg plus 01.jpg, 02.jpg…).
 * Do not invent dates. Leave date empty until the school confirms it.
 */
window.JB_EVENTS = [
  {
    id: "sports-day",
    title: "Sports Day",
    description: "Races, games and medals from Sports Day on the school field.",
    category: "sports",
    theme: "sports",
    cover: "assets/img/sports-day-01.jpg",
    href: "sports-day.html",
    photos: Array.from({ length: 83 }, (_, i) => ({
      src: `assets/img/sports-day-${String(i + 1).padStart(2, "0")}.jpg`,
      alt: "Sports Day at Jingle Bells Pre-Primary and Nursery School"
    }))
  },
  {
    id: "yoga-day",
    title: "Yoga Day",
    description: "Children practising yoga together in school.",
    category: "activities",
    theme: "yoga",
    cover: "assets/img/yoga-day-03.jpg",
    href: "yoga-day.html",
    photos: Array.from({ length: 14 }, (_, i) => ({
      src: `assets/img/yoga-day-${String(i + 1).padStart(2, "0")}.jpg`,
      alt: "Yoga Day at Jingle Bells"
    }))
  },
  {
    id: "independence-day",
    title: "Independence Day",
    description: "Our children gathered in uniform with tricolour balloons.",
    category: "national",
    theme: "independence",
    cover: "assets/img/home-assembly-01.jpg",
    href: "gallery.html#independence-day",
    photos: [
      { src: "assets/img/home-assembly-01.jpg", alt: "Independence Day assembly at Jingle Bells" },
      { src: "assets/img/home-assembly-02.jpg", alt: "Teacher with children on Independence Day" },
      { src: "assets/img/home-assembly-03.jpg", alt: "Full school assembly with tricolour balloons" }
    ]
  },
  {
    id: "christmas",
    title: "Christmas Celebration",
    description: "Photographs will appear here when the school adds them to assets/events/christmas/.",
    category: "festival",
    theme: "christmas",
    cover: "",
    href: "gallery.html#christmas",
    photos: [],
    placeholderFolder: "assets/events/christmas/"
  },
  {
    id: "annual-day",
    title: "Annual Day",
    description: "Photographs will appear here when the school adds them to assets/events/annual-day/.",
    category: "festival",
    theme: "annual",
    cover: "",
    href: "gallery.html#annual-day",
    photos: [],
    placeholderFolder: "assets/events/annual-day/"
  },
  {
    id: "dahi-handi",
    title: "Dahi Handi Celebration",
    description: "Photographs will appear here when the school adds them to assets/events/dahi-handi/.",
    category: "festival",
    theme: "dahi",
    cover: "",
    href: "gallery.html#dahi-handi",
    photos: [],
    placeholderFolder: "assets/events/dahi-handi/"
  },
  {
    id: "school-picnic",
    title: "School Picnic",
    description: "Photographs will appear here when the school adds them to assets/events/school-picnic/.",
    category: "activities",
    theme: "picnic",
    cover: "",
    href: "gallery.html#school-picnic",
    photos: [],
    placeholderFolder: "assets/events/school-picnic/"
  },
  {
    id: "red-day",
    title: "Red Day Celebration",
    description: "Photographs will appear here when the school adds them to assets/events/red-day/.",
    category: "activities",
    theme: "red",
    cover: "",
    href: "gallery.html#red-day",
    photos: [],
    placeholderFolder: "assets/events/red-day/"
  },
  {
    id: "raksha-bandhan",
    title: "Raksha Bandhan",
    description: "Photographs will appear here when the school adds them to assets/events/raksha-bandhan/.",
    category: "festival",
    theme: "rakhi",
    cover: "",
    href: "gallery.html#raksha-bandhan",
    photos: [],
    placeholderFolder: "assets/events/raksha-bandhan/"
  },
  {
    id: "fancy-dress",
    title: "Fancy Dress Competition",
    description: "Photographs will appear here when the school adds them to assets/events/fancy-dress/.",
    category: "activities",
    theme: "fancy",
    cover: "",
    href: "gallery.html#fancy-dress",
    photos: [],
    placeholderFolder: "assets/events/fancy-dress/"
  },
  {
    extra: true,
    id: "diwali",
    title: "Diwali Celebration",
    description: "Add photographs later in assets/events/diwali/.",
    category: "festival",
    theme: "rakhi",
    cover: "",
    href: "gallery.html#diwali",
    photos: [],
    placeholderFolder: "assets/events/diwali/"
  },
  {
    extra: true,
    id: "holi",
    title: "Holi Celebration",
    description: "Add photographs later in assets/events/holi/.",
    category: "festival",
    theme: "fancy",
    cover: "",
    href: "gallery.html#holi",
    photos: [],
    placeholderFolder: "assets/events/holi/"
  },
  {
    extra: true,
    id: "yellow-day",
    title: "Yellow Day",
    description: "Add photographs later in assets/events/yellow-day/.",
    category: "activities",
    theme: "picnic",
    cover: "",
    href: "gallery.html#yellow-day",
    photos: [],
    placeholderFolder: "assets/events/yellow-day/"
  },
  {
    extra: true,
    id: "green-day",
    title: "Green Day",
    description: "Add photographs later in assets/events/green-day/.",
    category: "activities",
    theme: "yoga",
    cover: "",
    href: "gallery.html#green-day",
    photos: [],
    placeholderFolder: "assets/events/green-day/"
  },
  {
    extra: true,
    id: "blue-day",
    title: "Blue Day",
    description: "Add photographs later in assets/events/blue-day/.",
    category: "activities",
    theme: "picnic",
    cover: "",
    href: "gallery.html#blue-day",
    photos: [],
    placeholderFolder: "assets/events/blue-day/"
  },
  {
    extra: true,
    id: "childrens-day",
    title: "Children's Day",
    description: "Add photographs later in assets/events/childrens-day/.",
    category: "activities",
    theme: "annual",
    cover: "",
    href: "gallery.html#childrens-day",
    photos: [],
    placeholderFolder: "assets/events/childrens-day/"
  },
  {
    extra: true,
    id: "teachers-day",
    title: "Teachers' Day",
    description: "Add photographs later in assets/events/teachers-day/.",
    category: "activities",
    theme: "annual",
    cover: "",
    href: "gallery.html#teachers-day",
    photos: [],
    placeholderFolder: "assets/events/teachers-day/"
  },
  {
    extra: true,
    id: "graduation-day",
    title: "Graduation Day",
    description: "Add photographs later in assets/events/graduation-day/.",
    category: "activities",
    theme: "annual",
    cover: "",
    href: "gallery.html#graduation-day",
    photos: [],
    placeholderFolder: "assets/events/graduation-day/"
  }
];
