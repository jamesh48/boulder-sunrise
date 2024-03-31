export const useCurrentWindowPercentages = (
  sunriseLinePlacement: number | undefined,
  sunsetLinePlacement: number | undefined
) => {
  if (!sunriseLinePlacement || !sunsetLinePlacement) {
    return [0];
  }
  const windowHeight = window.innerHeight;

  return [
    (sunriseLinePlacement / windowHeight) * 100,
    (sunsetLinePlacement / windowHeight) * 100,
  ];
};
