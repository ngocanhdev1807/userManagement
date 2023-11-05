import forEach from "lodash/forEach";
export const addCallback = ({
  customChecks,
}: {
  customChecks: {
    mutateAsync(arg0: { _id: string; check: number }): unknown;
    check: () => boolean;
    callbacks: () => void;
  }[];
}) =>
  forEach(customChecks, ({ check, callbacks }, index) => {
    check() && Promise.all([callbacks()]);
  });
