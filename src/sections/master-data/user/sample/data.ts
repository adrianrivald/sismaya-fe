export const _id = (index: number) => `e99f09a7-dd88-49d5-b1c8-1daf80c2d7b${index}`;


export const _name = (index: number) => [
    'Internal Comp1',
  ][index]
  
  export const _company = (index: number) => [
    'Company 1',
  ][index]
  
  export const _division = (index: number) => [
    'Div 3',
  ][index]
  
  export const _email = (index: number) => [
    'testuser@gmail.com'
  ][index]
  
  export const _role = (index: number) => [
    'Staff'
  ][index]

  
  export const _phone = (index: number) => [
    '+62812121212'
  ][index]

export const _userComp = [...Array(1)].map((_, index) => ({
    id: _id(index),
    name: _name(index),
    company: _company(index),
    division: _division(index),
    email: _email(index),
    phone: _phone(index),
    role: _role(index),
  }));