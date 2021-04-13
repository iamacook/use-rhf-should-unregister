import { RefObject, useCallback, useEffect } from 'react';

export const useRHFShouldUnregister = (
	ref: RefObject<HTMLFormElement>,
	unregister: any // UseFormUnregister
) => {
	const handleShouldUnregister = useCallback(
		(mutations: MutationRecord[]) =>
			mutations.forEach(({ removedNodes }) =>
				removedNodes?.forEach((node) =>
					// Unregister all removed inputs via their name attrbute
					(node as HTMLElement)
						?.querySelectorAll(
							'input[name], select[name], textarea[name]'
						)
						?.forEach((input) => {
							const name = (input as
								| HTMLInputElement
								| HTMLSelectElement
								| HTMLTextAreaElement).name;
							unregister(name);
						})
				)
			),
		[unregister]
	);

	useEffect(() => {
		if (!ref.current) return;

		// Watch all DOM changes that occur within the form
		const observer = new MutationObserver(handleShouldUnregister);
		const options = { childList: true, subtree: true };

		observer.observe(ref.current, options);
		return () => observer.disconnect();
	}, [ref, handleShouldUnregister]);
};
