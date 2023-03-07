import { Flex, Button } from '@offsideswap/uikit'
import NextLink from 'next/link'
import { useTranslation } from '@offsideswap/localization'

const MoreButton = () => {
  const { t } = useTranslation()

  return (
    <Flex justifyContent="center" m="50px auto">
      <NextLink href="/#all" passHref>
        <Button scale="md" variant="secondary">
          {t('More')}
        </Button>
      </NextLink>
    </Flex>
  )
}

export default MoreButton
