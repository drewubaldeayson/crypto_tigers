pragma solidity 0.5.16;

import "./TigerBreeding.sol";

/**
 * @title The TigerMinting contract responsible to create tigers.
 * @author Andrew Ayson
 */
contract TigerMinting is TigerBreeding {
    /// @dev Limits the number of tigers the contract owner can ever create.
    uint256 public constant CREATION_LIMIT_GEN0 = 1000; 

    /// @dev Counts the number of tigers the contract owner has created.
    uint256 public gen0Count;

    /**
     * @notice Creates a new gen0 tiger
     * @dev Can only be called by owner and when limit has not be reached
     * @return The id of the created tiger
     */
    function createGen0Tiger(uint256 _genes) external onlyOwner returns (uint256) {
        require(gen0Count < CREATION_LIMIT_GEN0, "Limit gen0 reached");

        gen0Count = gen0Count.add(1);

        return _createTiger(0, 0, 0, _genes, msg.sender);
    }
}
