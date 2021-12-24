pragma solidity 0.5.16;

import "./TigerMinting.sol";

/**
 * @title The TigerCore contract.
 * @author Andrew Ayson
 * @dev This contract is split in the following way:
 *      - TigerBase: This is where we define the most fundamental code shared throughout the core
 *             functionality. This includes our main data storage, constants and data types, plus
 *             internal functions for managing these items.
 *      - TigerOwnership: This provides the methods required for basic non-fungible token
 *      - TigerBreeding: This file contains the methods necessary to breed tigers together
 *      - TigerMinting: This final facet contains the functionality we use for creating new gen0 tigers.
 */
contract TigerCore is TigerMinting {
    /**
     * @notice Returns all the relevant information about a specific tiger
     * @param _tigerId the id of the tiger to get information from
     */
    function getTiger(uint256 _tigerId)
        public
        view
        returns (
            uint256 genes,
            uint256 birthTime,
            uint256 dadId,
            uint256 momId,
            uint256 generation
        )
    {
        Tiger storage tiger = _tigers[_tigerId];

        birthTime = uint256(tiger.birthTime);
        dadId = uint256(tiger.dadId);
        momId = uint256(tiger.momId);
        generation = uint256(tiger.generation);
        genes = tiger.genes;
    }
}
