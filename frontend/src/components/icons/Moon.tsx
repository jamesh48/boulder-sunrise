import { SvgIcon, SxProps } from '@mui/material';

interface MoonIconProps {
  sx?: SxProps;
}

const MoonIcon = (props: MoonIconProps) => {
  return (
    <SvgIcon sx={{ fontSize: 100, ...props.sx }}>
      <svg
        fill="blue"
        height="800px"
        width="800px"
        version="1.1"
        id="Layer_1"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 352.726 352.726"
        xmlSpace="preserve"
      >
        <g>
          <g>
            <g>
              <path
                d="M245.879,1.526c-5.6-2.8-12-1.6-16.8,2.4s-6.8,10-5.2,16c4,16.4,5.6,33.6,4.4,51.6c-5.2,84-72.8,151.2-156.8,156.4
				c-17.2,1.2-34.4-0.4-51.6-4c-6-1.6-12,0.4-16,5.6c-4,4.8-4.8,11.2-2.4,16.8c30.4,65.2,95.2,106.4,167.2,106.4c3.2,0,6.8,0,10-0.4
				c92.4-4.8,168.4-81.2,173.6-173.6C356.679,103.126,315.079,33.526,245.879,1.526z M336.279,177.926c-4.4,84.4-74,154-158.4,158.4
				c-69.2,3.6-132.8-34.4-161.6-96.8c18.8,4.4,37.6,5.6,56.4,4.4c92-6,166-79.6,172-171.6c1.2-19.6-0.4-38.4-4.8-56.4
				C302.279,45.126,340.279,108.726,336.279,177.926z"
              />
              <path
                d="M242.679,277.526c-3.6,2.4-4.4,7.6-2,11.2c1.6,2.4,4,3.6,6.8,3.6c1.6,0,3.2-0.4,4.4-1.2c30.8-21.6,52.8-52.8,60.8-89.2
				c0.8-4.4-1.6-8.8-6-9.6c-4.4-0.8-8.4,1.6-9.6,6C289.879,230.726,270.679,258.726,242.679,277.526z"
              />
              <path
                d="M213.479,292.726c-2.4,0.8-4.4,1.6-7.2,2.4c-4.4,1.2-6.8,5.6-5.6,10c1.2,3.6,4.4,6,7.6,6c0.8,0,1.6,0,2.4-0.4
				c3.6-0.8,6-2,8.8-3.2c4-1.6,6-6.4,4.4-10.4C222.279,292.726,217.479,290.726,213.479,292.726z"
              />
            </g>
          </g>
        </g>
      </svg>
    </SvgIcon>
  );
};

export default MoonIcon;
