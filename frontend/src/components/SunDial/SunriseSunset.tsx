import { CustomTooltip } from '../CustomComponents/CustomTooltip';

interface SunriseSunsetProps {
  tooltipTitle: string;
  isMoonTime: boolean;
  lineRef: React.RefObject<HTMLHRElement>;
}

const SunriseSunset = (props: SunriseSunsetProps) => {
  return (
    <CustomTooltip
      title={props.tooltipTitle}
      placement="top"
      ismoontime={props.isMoonTime}
    >
      <hr
        ref={props.lineRef}
        style={{
          position: 'absolute',
          width: '100%',
          top: 0,
          left: 0,
          cursor: 'help',
          opacity: 0.05,
        }}
      />
    </CustomTooltip>
  );
};

export default SunriseSunset;
