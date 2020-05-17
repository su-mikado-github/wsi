select
  *
from
  m_layer1_division_values t
where
  t.division_id = :division_id
  <?php if (isset($binds['delete_flag'])) { ?>and t.delete_flag = :delete_flag<?php } ?>
order by
  t.sort_order
