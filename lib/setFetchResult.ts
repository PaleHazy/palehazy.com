import type { Dispatch, SetStateAction } from 'react';

export async function setFetchResult<Data>(
  relPath: string,
  setStateFunction: Dispatch<SetStateAction<Data>>,
  requestOptions?: RequestInit
) {
  const fetchResult = await fetch(relPath, requestOptions);
  const jsonResult = await fetchResult.json();
  setStateFunction(jsonResult);
}
