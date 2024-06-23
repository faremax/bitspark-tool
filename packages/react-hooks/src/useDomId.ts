import { useState } from 'react';
import { nanoid } from 'nanoid';

export default (length = 8) => {
  const [id] = useState(nanoid(length));
  return id;
}