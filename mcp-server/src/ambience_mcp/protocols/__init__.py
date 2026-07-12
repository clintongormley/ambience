"""One frozen adapter per backend protocol, all shipped together.

The latest `ambience-mcp` contains an adapter for every protocol it supports and
loads the one the backend names in `ambience/mcp/hello`. That is what lets one
`uvx`-resolved package serve several Home Assistant installs on different Ambience
versions — a promise the README already makes — and what makes "upgrade ambience-mcp"
always a safe instruction: the newest package still speaks the older protocols.

Adding a protocol: write `vN.py`, register it here, and bump `MCP_PROTOCOL` in the
integration. `bin/check_mcp_protocol.py` asserts the two never drift apart.
"""

from __future__ import annotations

from .base import BaseProtocol
from .v1 import ProtocolV1

PROTOCOLS: dict[int, type[BaseProtocol]] = {1: ProtocolV1}

__all__ = ["PROTOCOLS", "BaseProtocol", "ProtocolV1"]
