export const blogPosts = [
  {
    number: '01',
    slug: 'how-addis-eats-keeps-search-fast',
    title: 'How Addis Eats keeps search fast',
    excerpt: 'A small pause in typing and a server-seeded menu make searching feel calmer and cut unnecessary requests.',
    sections: [
      { heading: 'Render the first useful result on the server', body: 'The menu is public data, so the server can send it with the page instead of making everyone wait for the browser to fetch a second copy. That helps the menu remain useful to search engines and to people on a slower connection.' },
      { heading: 'Wait for the user to pause', body: 'Search waits 450 milliseconds after typing before requesting results. The input still feels immediate, but the network does not receive a request for every key stroke. Category and popular-only filters are applied to the same catalog.' },
      { heading: 'Make an empty result helpful', body: 'If a search has no matches, the interface says so and offers a simple way back to the menu. Empty states should guide the next step, not look like a broken page.' }
    ]
  },
  {
    number: '02',
    slug: 'what-live-order-status-means',
    title: 'What “live order status” really means',
    excerpt: 'Five-second polling is a practical fit for food orders, as long as the server seeds the first status and protects every read.',
    sections: [
      { heading: 'Seed the first status', body: 'The order page loads the current order on the server and passes it into the client query. The customer sees a useful status immediately rather than a blank card or spinner while the first request runs.' },
      { heading: 'Poll at a measured interval', body: 'SWR refreshes the order endpoint every five seconds. That is frequent enough for a demonstration food-order timeline without making the browser send requests every moment.' },
      { heading: 'Keep ownership on the server', body: 'Every order history read and status endpoint is scoped to the signed-in session. Hiding another order in the interface is not enough; the query itself must refuse an ID belonging to a different account.' }
    ]
  },
  {
    number: '03',
    slug: 'designing-for-a-slow-phone',
    title: 'Designing for a slow phone',
    excerpt: 'Good image budgets, predictable layouts and accessible controls make the experience better than another animation would.',
    sections: [
      { heading: 'Give the largest picture a budget', body: 'The hero uses a local WebP image, and the social preview uses a compressed 1200 by 630 JPEG. Both stay below 150 KB in the bundled project, so the first visit does not begin with a multi-megabyte photo.' },
      { heading: 'Reserve the image space', body: 'Menu images declare their dimensions or aspect ratio, reducing layout shifts while the browser paints them. Every image has an alt attribute, and decorative category artwork uses an empty alt because the nearby label already gives its meaning.' },
      { heading: 'Prefer understandable controls', body: 'Buttons have visible focus states, theme preference is remembered in the browser, and mobile navigation stays reachable with one hand. Reduced-motion preferences are respected instead of forcing animation on everyone.' }
    ]
  }
];

export function getBlogPost(slug) {
  return blogPosts.find((post) => post.slug === slug) ?? null;
}
