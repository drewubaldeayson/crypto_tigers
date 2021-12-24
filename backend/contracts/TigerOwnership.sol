pragma solidity 0.5.16;

import "./TigerBase.sol";
import "./interfaces/IERC721.sol";
import "./interfaces/IERC721Receiver.sol";

/**
 * @title The contract that handles ownership, Fully ERC721 (and ERC165) compliant, and
 * compliance withERC721Metadata and ERC721Enumerable
 * @author Andrew Ayson
 */
contract TigerOwnership is TigerBase, IERC721 {
    string public constant name = "CryptoTigers";
    string public constant symbol = "TIGER";

    /**
     * @dev Equals to `bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"))`
     *which can be also obtained as `IERC721Receiver(0).onERC721Received.selector`
     */
    bytes4 private constant _ERC721_RECEIVED = 0x150b7a02;

    /**
     * @dev Interface id's to provide via supportsInterface
     */
    bytes4 private constant _INTERFACE_ID_ERC721 = 0x80ac58cd;
    bytes4 private constant _INTERFACE_ID_ERC165 = 0x01ffc9a7;

    /**
     * @notice Query if a contract implements an interface
     * @param _interfaceId The interface identifier, as specified in ERC-165
     * @dev Interface identification is specified in ERC-165. This function
     *  uses less than 30,000 gas.
     * @return true if the contract implements _interfaceId and
     *  _interfaceId is not 0xffffffff, false otherwise
     */
    function supportsInterface(bytes4 _interfaceId)
        external
        view
        returns (bool)
    {
        return (_interfaceId == _INTERFACE_ID_ERC721 ||
            _interfaceId == _INTERFACE_ID_ERC165);
    }

    /**
     * @notice Count all Tigers assigned to an owner
     * @dev [ERC721] Tigers assigned to the zero address are considered invalid, and this
     * function throws for queries about the zero address
     * @param _owner The address to check
     * @return The address of the owner of the tiger
     */
    function balanceOf(address _owner) public view returns (uint256) {
        require(_owner != address(0), "Balance query for the zero address");

        return _ownedTigersCount[_owner];
    }

    /**
     * @notice Find the owner of an Tiger
     * @dev [ERC721] Tigers assigned to the zero address are considered invalid, and this
     * function throws for queries about the zero address
     * @return the address of the onwer of _tigerId
     */
    function ownerOf(uint256 _tigerId) public view returns (address) {
        address owner = _tigerIdToOwner[_tigerId];
        require(owner != address(0), "Owner query for nonexistent tiger");

        return owner;
    }

    /**
     * @dev Util function to checks if _tigerId is owned by _address
     * @param _address The address we are validating against.
     * @param _tigerId The tiger id to check
     * @return true when _tigerId is owned by _address, false otherwise
     */
    function _owns(address _address, uint256 _tigerId)
        internal
        view
        returns (bool)
    {
        return ownerOf(_tigerId) == _address;
    }

    /**
     * @dev Util function to checks if _tigerId exists, ie. the owner is not a 0 address
     * @param _tigerId The tiger id to check
     * @return true when _tigerId is a registered token, false otherwise
     */
    function _exists(uint256 _tigerId) internal view returns (bool) {
        address owner = _tigerIdToOwner[_tigerId];
        return owner != address(0);
    }

    /**
     * @dev Util function to checks if address is a contract.
     * @dev WARNING: This method relies in extcodesize, which returns 0 for contracts in
     * construction, since the code is only stored at the end of the
     * constructor execution
     * @param _account The address to check.
     * @return true when _account is a contract, false otherwise
     */
    function _isContract(address _account) internal view returns (bool) {
        uint256 size;
        // solhint-disable-next-line
        assembly {
            size := extcodesize(_account)
        }
        return size > 0;
    }

    /**
     * @dev Checks if the address is authorized to do the transfer. This is
     * is the current owner, an authorized operator, or the approved address for this Tiger.
     * @param _address address to check
     * @param _tigerId tiger id to check
     * @return true when _address is authorized to transfer, false otherwise
     */
    function _isAuthorized(address _address, uint256 _tigerId)
        internal
        view
        returns (bool)
    {
        address _owner = ownerOf(_tigerId);
        return (_address == _owner ||
            getApproved(_tigerId) == _address ||
            isApprovedForAll(_owner, _address));
    }

    /**
     * @dev Internal function to invoke {IERC721Receiver-onERC721Received} on a target address.
     * The call is not executed if the target address is not a contract.
     * @param _from address representing the previous owner of the given tiger id
     * @param _to target address that will receive the tokens
     * @param _tigerId The id of the tiger to be transferred
     * @param _data bytes optional data to send along with the call
     * @return True if _to is a valid address, false otherwise
     */
    function _checkOnERC721Received(
        address _from,
        address _to,
        uint256 _tigerId,
        bytes memory _data
    ) internal returns (bool) {
        if (!_isContract(_to)) {
            return true;
        }

        bytes4 returndata = IERC721Receiver(_to).onERC721Received(
            msg.sender,
            _from,
            _tigerId,
            _data
        );

        return (returndata == _ERC721_RECEIVED);
    }

    /**
     * @dev Safely transfers `tokenId` token from `from` to `to`,
     * checking first that contract recipients
     * are aware of the ERC721 protocol to prevent tokens from being forever locked.
     * @param _from current owner of the tiger
     * @param _to address to receive the ownership of the given tiger id
     * @param _tigerId uint256 id of the tiger to be transferred
     * @param _data bytes data to send along with a safe transfer check
     */
    function _safeTransfer(
        address _from,
        address _to,
        uint256 _tigerId,
        bytes memory _data
    ) internal {
        _transfer(_from, _to, _tigerId);
        require(
            _checkOnERC721Received(_from, _to, _tigerId, _data),
            "transfer to non ERC721Receiver"
        );
    }

    /**
     * @notice Transfers the ownership of an Tiger from one address to another address
     * @dev [ERC721] Transfer implementation with a check on caller if it can accept ERC721
     * Requires
     * - valid token
     * - valid, non-zero _to address (via _transfer)
     * - not to this address to prevent potential misuse (via _transfer)
     * - msg.sender to be the owner, approved, or operator
     * - when the caller is a smart contract, it should accept ERC721 tokens
     * @param _from current owner of the tiger
     * @param _to address to receive the ownership of the given tiger id
     * @param _tigerId uint256 id of the tiger to be transferred
     */
    function safeTransferFrom(
        address _from,
        address _to,
        uint256 _tigerId
    ) public {
        safeTransferFrom(_from, _to, _tigerId, "");
    }

    /**
     * @notice Transfers the ownership of an Tiger from one address to another address
     * @dev [ERC721] This works identically to the other function with an extra data parameter
     * except this function just sets data to ""
     * @param _from current owner of the tiger
     * @param _to address to receive the ownership of the given tiger id
     * @param _tigerId The id of the tiger to be transferred
     * @param _data bytes data to send along with a safe transfer check
     */
    function safeTransferFrom(
        address _from,
        address _to,
        uint256 _tigerId,
        bytes memory _data
    ) public {
        require(_exists(_tigerId), "nonexistent token");
        require(_isAuthorized(msg.sender, _tigerId), "not authorized");

        _safeTransfer(_from, _to, _tigerId, _data);
    }

    /**
     * @notice Transfer ownership of a Tiger -- THE CALLER IS RESPONSIBLE
     *  TO CONFIRM THAT `_to` IS CAPABLE OF RECEIVING TIGERS OR ELSE
     *  THEY MAY BE PERMANENTLY LOST
     * @dev [ERC721] Transfers the ownership of a given token id to another address
     * Requires
     * - valid token
     * - valid, non-zero _to address (via _transfer)
     * - not to this address to prevent potential misuse (via _transfer)
     * - msg.sender to be the owner, approved, or operator
     * @param _from current owner of the tiger
     * @param _to address to receive the ownership of the given tiger id
     * @param _tigerId id of the tiger to be transferred
     */
    function transferFrom(
        address _from,
        address _to,
        uint256 _tigerId
    ) public {
        require(_exists(_tigerId), "nonexistent token");
        require(_isAuthorized(msg.sender, _tigerId), "not authorized");

        _transfer(_from, _to, _tigerId);
    }

    /**
     * @notice Transfers the ownership of an own Tiger to another address
     * @param _to address to receive the ownership of the given tiger id
     * @param _tigerId id of the tiger to be transferred
     */
    function transfer(address _to, uint256 _tigerId) external {
        safeTransferFrom(msg.sender, _to, _tigerId);
    }

    /**
     * @notice Change or reaffirm the approved address for an tiger
     * @dev [ERC721] The zero address indicates there is no approved address
     * Requires
     * - msg.sender is owner or approved opperator
     * - cannot approve owner
     * @param _to The address.
     * @param _tigerId The tiger id that is approved for
     */
    function approve(address _to, uint256 _tigerId) public {
        address _owner = ownerOf(_tigerId);
        require(_to != _owner, "approval to current owner");
        require(
            _owns(msg.sender, _tigerId),
            "approve caller is not owner nor approved for all"
        );

        _tigerIdToApproved[_tigerId] = _to;
        emit Approval(_owner, _to, _tigerId);
    }

    /**
     * @notice Enable or disable approval for a third party ("operator") to manage
     * all of `msg.sender`'s assets
     * @dev [ERC721] Emits the ApprovalForAll event.
     * Requires
     * - cannot approve self
     * @param _operator The tiger id
     * @param _approved The approval status
     */
    function setApprovalForAll(address _operator, bool _approved) public {
        require(_operator != msg.sender, "approval to caller");

        _operatorApprovals[msg.sender][_operator] = _approved;
        emit ApprovalForAll(msg.sender, _operator, _approved);
    }

    /**
     * @notice Get the approved address for a single tiger
     * @dev [ERC721] Get the approval address of the tiger
     * Requires
     * - _tigerId must exist
     * @param _tigerId The tiger id
     * @return The approved address for this tiger, or the zero address if there is none
     */
    function getApproved(uint256 _tigerId) public view returns (address) {
        require(_exists(_tigerId), "approved query for nonexistent tiger");

        return _tigerIdToApproved[_tigerId];
    }

    /**
     * @notice Query if an address is an authorized operator for another address
     * @dev [ERC721]
     * @param _owner The owner
     * @param _operator The operator
     * @return True if `_operator` is an approved operator for `_owner`, false otherwise
     */
    function isApprovedForAll(address _owner, address _operator)
        public
        view
        returns (bool)
    {
        return _operatorApprovals[_owner][_operator];
    }

    /**
     * @notice Count tigers tracked by this contract
     * @dev [ERC721Enumerable]
     * @return A count of valid tigers tracked by this contract, where each one of
     *  them has an assigned and queryable owner not equal to the zero address
     */
    function totalSupply() public view returns (uint256) {
        return _tigers.length;
    }

    /**
     * @notice Enumerate valid tigers
     * @dev [ERC721Enumerable]
     * Requires:
     *  - _index < totalSupply()
     * @param _index A counter less than `totalSupply()`
     * @return _index which is the same as the identifier
     */
    function tokenByIndex(uint256 _index) external view returns (uint256) {
        require(_index < totalSupply(), "index out of bounds");
        return _index;
    }

    /**
     * @notice Returns a list of all Tiger IDs assigned to an address.
     * @dev [ERC721Enumerable]
     * Requires
     *  - _index < balanceOf(_owner)
     *  - _owner is  non-zero address
     * @dev Be aware when calling this contract as its quite expensive because it
     * loops through all tigers
     * @param _owner An address where we are interested in tigers owned by them
     * @return The token identifier for the `_index`th tiger assigned to `_owner`,
     *   (sort order not specified)
     */
    function tokensOfOwner(address _owner)
        public
        view
        returns (uint256[] memory)
    {
        require(_owner != address(0), "Token query for the zero address");

        uint256 tokenCount = balanceOf(_owner);

        if (tokenCount == 0) {
            // Return an empty array
            return new uint256[](0);
        }

        uint256[] memory result = new uint256[](tokenCount);
        uint256 totalTigers = totalSupply();
        uint256 resultIndex = 0;

        uint256 tigerId;

        for (tigerId = 0; tigerId <= totalTigers; tigerId++) {
            if (_tigerIdToOwner[tigerId] == _owner) {
                result[resultIndex] = tigerId;
                resultIndex++;
            }
        }

        return result;
    }

    /**
     * @dev Gets the token ID at a given index of the tokens list of the requested owner.
     * @dev Be aware when calling this contract as its quite expensive because it
     * loops through all tigers. Could potentially be optimized if we save all tigers also
     * in an mapping of owners.
     * @param _owner address owning the tokens list to be accessed
     * @param _index uint256 representing the index to be accessed of the requested tokens list
     * @return uint256 token ID at the given index of the tokens list owned by the requested address
     */
    function tokenOfOwnerByIndex(address _owner, uint256 _index)
        public
        view
        returns (uint256)
    {
        require(_index < balanceOf(_owner), "index out of bounds");
        return tokensOfOwner(_owner)[_index];
    }
}
