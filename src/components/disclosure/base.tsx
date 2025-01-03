import * as React from 'react';
import { pipe } from 'src/utils/functions';
import { createContext } from 'src/utils/create.context';
import type { MaybeRenderProp } from 'src/utils/types';

interface DisclosureValue {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

interface ButtonDisclosureProps {
  children: React.ReactElement;
}

interface RootDisclosureProps extends Partial<DisclosureValue> {
  children: MaybeRenderProp<DisclosureValue>;
}

export const [useDisclosure, DisclosureProvider] = createContext<DisclosureValue>({
  name: 'BaseDisclosureContext',
});

/**
 * @example
 * <BaseDisclosure.Root>
 * 	<BaseDisclosure.OpenButton>
 * 		<Button>Open</Button>
 * 	</BaseDisclosure.OpenButton>
 *
 * 	<BaseDisclosure.Content>
 * 		<BaseDisclosure.CloseButton />
 *
 * 		<Text>Lorem ipsum dolor.</Text>
 * 	</BaseDisclosure.Content>
 * </BaseDisclosure.Root>
 */
export function Root(props: RootDisclosureProps) {
  // eslint-disable-next-line react/destructuring-assignment
  const [isOpen, setIsOpen] = React.useState(props.isOpen ?? false);

  function onOpen() {
    // eslint-disable-next-line react/destructuring-assignment
    props.onOpen?.();
    setIsOpen(true);
  }

  function onClose() {
    // eslint-disable-next-line react/destructuring-assignment
    props.onClose?.();
    setIsOpen(false);
  }

  const value = { isOpen, onOpen, onClose };

  return (
    <DisclosureProvider value={value}>
      {/* eslint-disable-next-line react/destructuring-assignment */}
      {props.children instanceof Function ? props.children(value) : props.children}
    </DisclosureProvider>
  );
}

export function OpenButton({ children: child }: ButtonDisclosureProps) {
  const { onOpen } = useDisclosure();

  return React.cloneElement(child, {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    onClick: pipe(onOpen, child.props.onClick),
  });
}

export function DismissButton({ children: child }: ButtonDisclosureProps) {
  const { onClose } = useDisclosure();

  return React.cloneElement(child, {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    onClick: pipe(onClose, child.props.onClick),
  });
}
