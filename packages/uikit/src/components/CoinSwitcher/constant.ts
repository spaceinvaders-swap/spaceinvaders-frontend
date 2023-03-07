const PATH = `https://cdn.offsideswap.com/sequnce-assets/`;

export const BNB2ROTO_PATH = `${PATH}bnb2roto/bnb2roto-`;
export const BNB2ROTO_COUNTS = 31;

export const ROTO2BNB_PATH = `${PATH}rotobnb/roto2bnb-`;
export const ROTO2BNB_COUNTS = 31;

export const FILE_TYPE = `.png`;

const pathGenerator = (path: string) => (d: string, index: number) => {
  if (index < 10) return `${path}0${index}${FILE_TYPE}`;
  return `${path}${index}${FILE_TYPE}`;
};

export const bnb2RotoImages = () => {
  let result: string[] = new Array(BNB2ROTO_COUNTS);
  result.fill("");
  result = result.map(pathGenerator(BNB2ROTO_PATH));
  return result;
};

export const roto2BnbImages = () => {
  let result: string[] = new Array(ROTO2BNB_COUNTS);
  result.fill("");
  result = result.map(pathGenerator(ROTO2BNB_PATH));
  return result;
};
