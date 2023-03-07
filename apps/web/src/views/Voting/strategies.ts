const votePowerAddress = {
  v0: '0xc0FeBE244cE1ea66d27D23012B3D616432433F42',
  v1: '0x67Dfbb197602FDB9A9D305cC7A43b95fB63a0A56',
}

export const rotoBalanceStrategy = (version: 'v0' | 'v1') => ({
  name: 'contract-call',
  params: {
    address: votePowerAddress[version],
    decimals: 18,
    methodABI: {
      inputs: [
        {
          internalType: 'address',
          name: '_user',
          type: 'address',
        },
      ],
      name: 'getRotoBalance',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
  },
})

export const rotoVaultBalanceStrategy = (version: 'v0' | 'v1') => ({
  name: 'contract-call',
  params: {
    address: votePowerAddress[version],
    decimals: 18,
    methodABI: {
      inputs: [
        {
          internalType: 'address',
          name: '_user',
          type: 'address',
        },
      ],
      name: 'getRotoVaultBalance',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
  },
})

export const ifoPoolBalanceStrategy = {
  name: 'contract-call',
  params: {
    address: votePowerAddress.v0,
    decimals: 18,
    methodABI: {
      inputs: [
        {
          internalType: 'address',
          name: '_user',
          type: 'address',
        },
      ],
      name: 'getIFOPoolBalancee',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
  },
}

export const rotoPoolBalanceStrategy = (version: 'v0' | 'v1') => ({
  name: 'contract-call',
  params: {
    address: votePowerAddress[version],
    decimals: 18,
    methodABI: {
      inputs: [
        {
          internalType: 'address',
          name: '_user',
          type: 'address',
        },
      ],
      name: 'getRotoPoolBalance',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
  },
})

export const rotoBnbLpBalanceStrategy = (version: 'v0' | 'v1') => ({
  name: 'contract-call',
  params: {
    address: votePowerAddress[version],
    decimals: 18,
    methodABI: {
      inputs: [
        {
          internalType: 'address',
          name: '_user',
          type: 'address',
        },
      ],
      name: 'getRotoBnbLpBalance',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
  },
})

export function createPoolsBalanceStrategy(poolAddress, version: 'v0' | 'v1') {
  return {
    name: 'contract-call',
    params: {
      address: votePowerAddress[version],
      decimals: 18,
      args: ['%{address}', poolAddress],
      methodABI: {
        inputs: [
          {
            internalType: 'address',
            name: '_user',
            type: 'address',
          },
          {
            internalType: 'address[]',
            name: '_pools',
            type: 'address[]',
          },
        ],
        name: 'getPoolsBalance',
        outputs: [
          {
            internalType: 'uint256',
            name: '',
            type: 'uint256',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
    },
  }
}

export function createTotalStrategy(poolAddress, version: 'v0' | 'v1') {
  return {
    name: 'contract-call',
    params: {
      address: votePowerAddress[version],
      decimals: 18,
      args: ['%{address}', poolAddress],
      methodABI: {
        inputs: [
          {
            internalType: 'address',
            name: '_user',
            type: 'address',
          },
          {
            internalType: 'address[]',
            name: '_pools',
            type: 'address[]',
          },
        ],
        name: 'getVotingPower',
        outputs: [
          {
            internalType: 'uint256',
            name: '',
            type: 'uint256',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
    },
  }
}

export function lockedRotoUser(
  rotoVaultAddress,
  outputName: 'lockedAmount' | 'lockEndTime' | 'shares' | 'userBoostedShare',
) {
  return {
    name: 'contract-call',
    params: {
      address: rotoVaultAddress,
      decimals: 0,
      output: outputName,
      args: ['%{address}'],
      methodABI: {
        inputs: [
          {
            internalType: 'address',
            name: '',
            type: 'address',
          },
        ],
        name: 'userInfo',
        outputs: [
          {
            internalType: 'uint256',
            name: 'shares',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'lastDepositedTime',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'rotoAtLastUserAction',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'lastUserActionTime',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'lockStartTime',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'lockEndTime',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'userBoostedShare',
            type: 'uint256',
          },
          {
            internalType: 'bool',
            name: 'locked',
            type: 'bool',
          },
          {
            internalType: 'uint256',
            name: 'lockedAmount',
            type: 'uint256',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
    },
  }
}

export function lockedRotoShare(rotoVaultAddress) {
  return {
    name: 'contract-call',
    params: {
      address: rotoVaultAddress,
      decimals: 0,
      methodABI: {
        inputs: [],
        name: 'getPricePerFullShare',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
      },
    },
  }
}
