pragma solidity 0.5.16;

import "./utils/SafeMath.sol";
import "./utils/Ownable.sol";

/**
 * @title The base contract that contains the base logic, structs and data that are needed
 * @author Andrew Ayson
 */
contract TigerBase is Ownable {
    using SafeMath for uint256;

    /**
     * @dev The Birth event is fired every time a new Tiger is created.
     * This includes the creation through breeding and creation via gen0
     */
    event Birth(
        address owner,
        uint256 tigerId,
        uint256 momId,
        uint256 dadId,
        uint256 genes
    );

    /**
     * @dev [ERC721] This emits when ownership of a Tiger changes by any mechanism.
     * This event emits when Tigers are created (`from` == 0) and destroyed
     * (`to` == 0). Exception: during contract creation, any number of Tigers
     * may be created and assigned without emitting Transfer. At the time of
     * any transfer, the approved address for that Tiger (if any) is reset to none.
     */
    event Transfer(
        address indexed from,
        address indexed to,
        uint256 indexed tigerId
    );

    /**
     * @dev [ERC721]  This emits when the approved address for an Tiger is changed or
     * reaffirmed. The zero address indicates there is no approved address.
     * When a Transfer event emits, this also indicates that the approved
     * address for that Tiger (if any) is reset to none.
     */
    event Approval(
        address indexed _owner,
        address indexed _approved,
        uint256 indexed _tigerId
    );

    /**
     * @dev This emits when an operator is enabled or disabled for an owner.
     * The operator can manage all Tigers of the owner.
     */
    event ApprovalForAll(
        address indexed _owner,
        address indexed _operator,
        bool _approved
    );

    /**
     * @dev The main Tiger struct, that contains all info about a tiger
     */
    struct Tiger {
        // The unique genes of this tiger
        uint256 genes;
        // The timestamp from the block when the tiger was born
        uint64 birthTime;
        // The references to its parents, set to 0 for gen0 tigers
        uint32 momId;
        uint32 dadId;
        // The genereation of the tiger. Tigers start with gen0,
        // and each breeded generation will have a higher generation number
        uint16 generation;
    }

    /**
     * @dev An array containing all tigers
     */
    Tiger[] internal _tigers;

    /// @dev Mapping from tiger id to owner address, must be a valid non-0 address
    mapping(uint256 => address) internal _tigerIdToOwner;
    /// @dev Mapping from tiger id to approved address
    mapping(uint256 => address) internal _tigerIdToApproved;
    /// @dev Mapping from owner to number of owned tiger
    mapping(address => uint256) internal _ownedTigersCount;
    /// @dev Mapping from tiger id to number of children
    mapping(uint256 => uint256[]) internal _tigerToChildren;

    /// @dev Mapping from owner to operator approvals
    mapping(address => mapping(address => bool)) internal _operatorApprovals;

    /**
     * @dev Assign ownership of a specific Tiger to an address.
     * @dev This poses no restriction on msg.sender
     * @param _from The address from who to transfer from, can be 0 for creation of a tiger
     * @param _to The address to who to transfer to, cannot be 0 address
     * @param _tigerId The id of the transfering tiger,
     */
    function _transfer(
        address _from,
        address _to,
        uint256 _tigerId
    ) internal {
        require(_to != address(0), "transfer to the zero address");
        require(_to != address(this));

        _ownedTigersCount[_to] = _ownedTigersCount[_to].add(1);
        _tigerIdToOwner[_tigerId] = _to;

        if (_from != address(0)) {
            _ownedTigersCount[_from] = _ownedTigersCount[_from].sub(1);
            delete _tigerIdToApproved[_tigerId];
        }

        emit Transfer(_from, _to, _tigerId);
    }

    /**
     * @dev Logic for creation of a tiger, via gen0 creation or breeding.
     * @param _momId The mother of the tiger (0 for gen0)
     * @param _dadId The dad of the tiger (0 for gen0)
     * @param _generation The generation number of this tiger, must be computed by caller
     * @param _genes The generic code, must me computed by the caller
     * @param _owner The initial owner, must me non-zero
     * @return The id of the created tiger
     */
    function _createTiger(
        uint256 _momId,
        uint256 _dadId,
        uint256 _generation,
        uint256 _genes,
        address _owner
    ) internal returns (uint256) {
        Tiger memory _tiger = Tiger({
            genes: _genes,
            birthTime: uint64(block.timestamp),
            momId: uint32(_momId),
            dadId: uint32(_dadId),
            generation: uint16(_generation)
        });

        uint256 newtigerId = _tigers.push(_tiger).sub(1);

        emit Birth(_owner, newtigerId, _momId, _dadId, _genes);

        _transfer(address(0), _owner, newtigerId);

        return newtigerId;
    }
}
