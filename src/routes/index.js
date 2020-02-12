import React, { lazy, Suspense } from 'react';
import { Redirect } from 'react-router-dom';
import Home from '../application/Home';
const RecommendComponent = lazy(() => import('../application/Recommend'));
const SingersComponent = lazy(() => import('../application/Singers'));
const RankComponent = lazy(() => import('../application/Rank'));
const AlbumComponent = lazy(() => import('../application/Album'));
const SingerComponent = lazy(() => import('../application/Singer'));
const SearchComponent = lazy(() => import('../application/Search'));
// import Recommend from '../application/Recommend';
// import Singers from '../application/Singers';
// import Rank from '../application/Rank';
// import Album from '../application/Album';
// import Singer from '../application/Singer';
// import Search from '../application/Search';

const SuspenseComponent = Component => props => {
  return (
    <Suspense fallback={null}>
      <Component {...props} />
    </Suspense>
  );
};

export default [
  {
    path: "/",
    component: Home,
    routes: [
      {
        path: "/",
        exact: true,
        render: () => (
          <Redirect to={"/recommend"} />
        )
      },
      {
        path: "/recommend",
        component: SuspenseComponent(RecommendComponent),
        routes: [
          {
            path: "/recommend/:id",
            component: SuspenseComponent(AlbumComponent)
          }
        ]
      },
      {
        path: "/singers",
        component: SuspenseComponent(SingersComponent),
        routes: [
          {
            path: "/singers/:id",
            component: SuspenseComponent(SingerComponent),
          }
        ]
      },
      {
        path: "/rank",
        component: SuspenseComponent(RankComponent),
        key: "rank",
        routes: [
          {
            path: "/rank/:id",
            component: SuspenseComponent(AlbumComponent)
          }
        ],
      },
      {
        path: "/album/:id",
        exact: true,
        key: "album",
        component: SuspenseComponent(AlbumComponent)
      },
      {
        path: "/search",
        exact: true,
        key: "search",
        component: SuspenseComponent(SearchComponent)
      }
    ]
  }
];

// export default [
//   {
//     path: "/",
//     component: Home,
//     routes: [
//       {
//         path: "/",
//         exact: true,
//         render: () => (
//           <Redirect to={"/recommend"} />
//         )
//       },
//       {
//         path: "/recommend",
//         component: Recommend,
//         routes: [
//           {
//             path: "/recommend/:id",
//             component: Album
//           }
//         ]
//       },
//       {
//         path: "/singers",
//         component: Singers,
//         routes: [
//           {
//             path: "/singers/:id",
//             component: Singer,
//           }
//         ]
//       },
//       {
//         path: "/rank",
//         component: Rank,
//         key: "rank",
//         routes: [
//           {
//             path: "/rank/:id",
//             component: Album
//           }
//         ],
//       },
//       {
//         path: "/album/:id",
//         exact: true,
//         key: "album",
//         component: Album
//       },
//       {
//         path: "/search",
//         exact: true,
//         key: "search",
//         component: Search
//       }
//     ]
//   }
// ];