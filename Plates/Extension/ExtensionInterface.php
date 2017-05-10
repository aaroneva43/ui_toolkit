<?php

namespace ui_toolkit\Plates\Extension;

use ui_toolkit\Plates\Engine;

/**
 * A common interface for extensions.
 */
interface ExtensionInterface
{
    public function register(Engine $engine);
}
