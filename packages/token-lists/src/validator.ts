import Ajv from 'ajv'
import schema from './schema/spaceinvaders-swap.json'

export const tokenListValidator = new Ajv({ allErrors: true }).compile(schema)
