export const _id = (index: number) => `e99f09a7-dd88-49d5-b1c8-1daf80c2d7b${index}`;


export const _name = (index: number) => [
    'Internal Comp1',
  ][index]
  
  export const _desc = (index: number) => [
    'Contoh deskripsi',
  ][index]
  
  export const _division = (index: number) => [
    'Div 1',
  ][index]
  
  export const _picture = (index: number) => [
    'https://postman.com/_aether-assets/illustrations/light/illustration-hit-send.svg',
  ][index]


export const _clientComp = [...Array(1)].map((_, index) => ({
    id: _id(index),
    name: _name(index),
    desc: _desc(index),
    picture: _picture(index),
    division: _division(index),
  }));