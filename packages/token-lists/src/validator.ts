import Ajv from 'ajv'
import schema from './schema/offsideswap.json'

export const tokenListValidator = new Ajv({ allErrors: true }).compile(schema)
