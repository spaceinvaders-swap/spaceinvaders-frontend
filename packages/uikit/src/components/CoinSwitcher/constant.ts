const PATH = `https://cdn.pancakeswap.com/sequnce-assets/`;

export const BNB2INVA_PATH = `${PATH}bnb2inva/bnb2inva-`;
export const BNB2INVA_COUNTS = 31;

export const INVA2BNB_PATH = `${PATH}invabnb/inva2bnb-`;
export const INVA2BNB_COUNTS = 31;

export const FILE_TYPE = `.png`;

const pathGenerator = (path: string) => (d: string, index: number) => {
  if (index < 10) return `${path}0${index}${FILE_TYPE}`;
  return `${path}${index}${FILE_TYPE}`;
};

export const bnb2InvaImages = () => {
  let result: string[] = new Array(BNB2INVA_COUNTS);
  result.fill("");
  result = result.map(pathGenerator(BNB2INVA_PATH));
  return result;
};

export const inva2BnbImages = () => {
  let result: string[] = new Array(INVA2BNB_COUNTS);
  result.fill("");
  result = result.map(pathGenerator(INVA2BNB_PATH));
  return result;
};
