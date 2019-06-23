# TODO

 -[ ] _heresy_ and _heresy-ssr_ share the exact same `ref`, `html`, and `svg` utilities. This means that components should always be developed using client side _heresy_ and these will work out of the box in _heresy-ssr_ too, since it uses exact same utilities. Test/validate this with an example.

 -[ ] in a list of items the _html_ or _svg_ helpers could be used, but also _ref_. Beside testing components work isomorphic out of the box, be sure these features are also tested.
