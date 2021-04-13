import { RefObject, useEffect } from 'react';
import {
  FieldValues,
  KeepStateOptions,
  Path,
  UseFormUnregister,
} from 'react-hook-form';

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

    const observer = new MutationObserver((mutations: MutationRecord[]) =>
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
      )
    );

    observer.observe(formRef.current, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [formRef]);
};
