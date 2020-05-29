select
  t.*
  , t1.value_type
  , t1.default_value_id
  , t1.division_name
from
  m_layer1_division_values t
  inner join m_layer1_divisions t1 on (
    t1.division_id = t.division_id
  )
where
  t.division_id = :division_id
  <?php if (isset($binds['delete_flag'])) { ?>and t.delete_flag = :delete_flag<?php } ?>
order by
  t.sort_order
