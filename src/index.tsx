import { RefObject, useEffect } from 'react';
import {
  FieldValues,
  KeepStateOptions,
  Path,
  UseFormUnregister,
} from 'react-hook-form';

// export const flatten = <T extends Record<string, any>>(
//   object: T,
//   path: string | null = null
// ) =>
//   Object.entries(object).reduce((acc: T, [key, value]: [string, any]): T => {
//     const newPath = [path, key].filter(Boolean).join('.');

//     const isObject = [
//       typeof value === 'object',
//       value !== null,
//       !(value instanceof Date),
//       !(value instanceof RegExp),
//       !(Array.isArray(value) && value.length === 0),
//     ].every(Boolean);

//     return isObject
//       ? { ...acc, ...flatten(value, newPath) }
//       : { ...acc, [newPath]: value };
//   }, {} as T);

const selector = 'input[name], select[name], textarea[name]';
type Field = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

export const useRHFShouldUnregister = <T extends FieldValues>(
  formRef: RefObject<HTMLFormElement>,
  unregister: UseFormUnregister<T>,
  keepStateOptions: KeepStateOptions
) => {
  useEffect(() => {
    if (!formRef.current) return;

    const handleUnregister = (node: Element) =>
      unregister((node as Field).name as Path<T>, keepStateOptions);

    const observer = new MutationObserver(
      (mutations: MutationRecord[], x: any) => {
        console.log(x);
        mutations.forEach(({ removedNodes }) =>
          removedNodes?.forEach((removedNode) => {
            if (!(removedNode instanceof Element)) return;

            if (removedNode.hasChildNodes()) {
              // All matching nodes
              removedNode.querySelectorAll(selector)?.forEach(handleUnregister);
            } else if (removedNode?.matches(selector)) {
              handleUnregister(removedNode);
            }
          })
        );
      }
    );

    observer.observe(formRef.current, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [formRef]);
};
